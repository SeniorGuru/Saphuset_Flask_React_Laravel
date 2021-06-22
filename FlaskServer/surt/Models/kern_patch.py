from sqlalchemy import create_engine, MetaData, Table, Column, String, INT, SMALLINT, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class kernPatch(Base):
    __tablename__ = 'kern_patch'
    MSSYSNAME = Column(String, primary_key=True)
    PATH_NUMBER = Column(String, primary_key=True)
    PATH_LEVEL = Column(String)
    NEW_RELEASE = Column(String)
    created_at = Column(DateTime)
    created_by = Column(String)
    updated_at = Column(DateTime)
    updated_by = Column(String)

# ALTER TABLE `22`.m_instance ADD created_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD created_by varchar(100) NULL;
# ALTER TABLE `22`.m_instance ADD updated_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD updated_by varchar(100) NULL;