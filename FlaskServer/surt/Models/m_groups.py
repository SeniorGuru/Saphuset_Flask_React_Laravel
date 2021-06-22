from sqlalchemy import create_engine,MetaData,Table,Column,String,INT,DateTime
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class mGroups(Base):
    __tablename__ = 'm_groups'
    group_id=Column(INT, primary_key = True)
    group_name=Column(String)
    group_description=Column(String)
