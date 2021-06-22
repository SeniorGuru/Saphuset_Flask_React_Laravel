from sqlalchemy import create_engine,MetaData,Table,Column,String,INT,DateTime
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class mInstanceGrouper(Base):
    __tablename__ = 'm_instance_grouper'
    row_id=Column(INT, primary_key = True)
    mssysname=Column(String)
    group_id=Column(INT)
    mandt=Column(DateTime)
    description=Column(String)
    updated_by=Column(String)
    updated_at=Column(String)
    created_at=Column(DateTime)
    created_by=Column(String)
