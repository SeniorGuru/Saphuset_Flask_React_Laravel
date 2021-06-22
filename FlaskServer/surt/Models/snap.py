from sqlalchemy import create_engine, MetaData, Table, Column, String, SMALLINT, DateTime, INTEGER
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class SNAP(Base):
    __tablename__ = 'snap'
    id = Column(INTEGER, primary_key=True, autoincrement=True)
    DATUM = Column(String)
    UZEIT = Column(String)
    UNAME = Column(String)
    MANDT = Column(String)
    AHOST = Column(String)
    SEQNO = Column(String)
    RUNTIME_ERROR = Column(String)
    EXCEPTION = Column(String)
    TERMINATED_PROGRAM = Column(String)
    TRANSACTION_ID = Column(String)
    FLIST = Column(String)
    MSSYSNAME = Column(String)
    APPROVED = Column(SMALLINT)
    SHORT_TEXT = Column(String)
    WHAT_HAPPEND = Column(String)
    updated_at = Column(DateTime)
    updated_by = Column(String)
    created_at = Column(DateTime)
    created_by = Column(String)
