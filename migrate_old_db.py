import pandas as pd
from sqlalchemy import create_engine
import psycopg2
import pyodbc

# Replace the connection parameters with your own values
db_user = "root"
db_password = "root"
db_host = "localhost"
db_port = "5499"
db_name = "mystudylife"

# Create the connection object
conn = psycopg2.connect(
    user=db_user,
    password=db_password,
    host=db_host,
    port=db_port,
    database=db_name
)

sourceServer = ''
sourceDatabase = ''
sourceUsername = ''
sourcePassword = ''
sourceDriver = '{ODBC Driver 17 for SQL Server}'

# Connection string
# conn_str = f'DRIVER={sourceDriver};SERVER={sourceServer};DATABASE={sourceDatabase};UID={sourceUsername};PWD={sourcePassword}'


# source_db = "postgresql+psycopg2://root:root@localhost:5822/ENTERDBNAMEHERE"
source_db = 'mssql+pyodbc://'+sourceUsername+':'+sourcePassword+'@'+sourceServer+'/'+sourceDatabase+'?driver=ODBC+Driver+17+for+SQL+Server'
target_db = "postgresql+psycopg2://root:root@localhost:5499/mystudylife"

source_engine = create_engine(source_db)
target_engine = create_engine(target_db)


# Query to get all table names
query = """
    SELECT table_name
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'dbo'
    ORDER BY table_name;
"""


source_conn_str = f'DRIVER={sourceDriver};SERVER={sourceServer};DATABASE={sourceDatabase};UID={sourceUsername};PWD={sourcePassword}'

# Connect to the database
cource_connection = pyodbc.connect(source_conn_str)

# Execute the query and display the result as a pandas DataFrame
tables_df = pd.read_sql_query(query, cource_connection)
print(tables_df)
# print(pd.read_sql_table('Users', source_db))
raise Exception("Stopping the script due to a custom exception")

# def drop_users_table_with_cascade():
   
#     with conn.cursor() as cur:
#         cur.execute('DROP TABLE "Users" CASCADE')
    
#     return 1


def migrate_users():
    # Read data from the source table
    source_data = pd.read_sql_table('user', source_engine)

    source_data.rename(columns={'firstname': 'firstName'}, inplace=True)
    source_data.rename(columns={'lastname': 'lastName'}, inplace=True)
    source_data.rename(columns={'identified': 'isVerified'}, inplace=True)
    source_data.rename(columns={'avatar': 'profileImage'}, inplace=True)
    source_data.rename(columns={'created_at': 'createdAt'}, inplace=True)
    source_data.rename(columns={'updated_at': 'updatedAt'}, inplace=True)

    source_data['role'] = 'student'
    source_data['password'] = '123123'
    source_data['salt'] = 'abc123'


    # columns_to_exclude = []
    # source_data = source_data.drop(columns_to_exclude, axis=1)

    # source_data.drop('id', axis=1, inplace=True)

    # Write data to the target table
    try:
        source_data.to_sql('Users', target_engine, if_exists='append', index=False, schema='public')
    except Exception as e:
        print(e)


def migrate_tasks():

    # Read data from the source table
    source_data = pd.read_sql_table('task', source_engine)

    source_data.rename(columns={'user_id': 'userId'}, inplace=True)
    source_data.rename(columns={'updated_at': 'updatedAt'}, inplace=True)
    source_data.rename(columns={'created_at': 'createdAt'}, inplace=True)
    source_data.rename(columns={'info': 'subject'}, inplace=True)

    source_data['details'] = 'Test'
    source_data['occurs'] = 'once'
    source_data['days'] = '{}'

  
    tasks_columns_to_exclude = ['assignee', 'reminder_due_date', 'type', 'data_id', 'deleted_at', 'status']
    source_data = source_data.drop(tasks_columns_to_exclude, axis=1)

    # print(source_data)
    # return 0

    # Write data to the target table
    try:
        source_data.to_sql('Tasks', target_engine, if_exists='append', index=False, schema='public')
    except Exception as e:
        print(e)



# drop_users_table_with_cascade()

migrate_users()

# migrate_tasks()