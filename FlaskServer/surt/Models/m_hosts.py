from sqlalchemy import create_engine,MetaData,Table,Column,String,SMALLINT,DateTime
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class mHosts(Base):
    __tablename__ = 'm_hosts'
    mssysname=Column(String, primary_key = True)
    mssrvname=Column(String,primary_key = True)
    server_description=Column(String)
    updated_at=Column(DateTime)
    updated_by=Column(String)
    created_at=Column(DateTime)
    created_by=Column(String)




