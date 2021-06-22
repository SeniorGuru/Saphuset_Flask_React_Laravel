from sqlalchemy import create_engine, MetaData, Table, Column, String, INT, SMALLINT, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class fmProcess(Base):
    __tablename__ = 'fm_process'
    id = Column(INT, primary_key=True)
    MSSYSNAME = Column(String)
    SERVER_NAME = Column(String)
    NUMBER = Column(INT)
    TYPE = Column(String)
    PROCESS_ID = Column(INT)
    PROCESS_STATE = Column(String)
    ON_HOLD_INFO = Column(String)
    WP_FAILUERS = Column(String)
    CPU_TIME = Column(String)
    TIME = Column(String)
    WAIT_PRIORITY = Column(String)
    PROGRAM_NAME = Column(String)
    CLIENT = Column(String)
    USER = Column(String)
    PRIORITY = Column(String)
    created_at = Column(DateTime)
    created_by = Column(String)
    updated_at = Column(DateTime)
    updated_by = Column(String)

# ALTER TABLE `22`.m_instance ADD created_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD created_by varchar(100) NULL;
# ALTER TABLE `22`.m_instance ADD updated_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD updated_by varchar(100) NULL;