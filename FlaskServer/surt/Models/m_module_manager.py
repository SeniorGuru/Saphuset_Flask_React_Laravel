from sqlalchemy import create_engine,MetaData,Table,Column,String,SMALLINT,DateTime
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class mModuleManager(Base):
    __tablename__ = 'm_module_manager'
    module_id=Column(String, primary_key = True)
    module_name=Column(String)
    module_description=Column(String)
    from_date=Column(DateTime)
    to_date=Column(DateTime)
    created_at=Column(DateTime)
    created_by=Column(String)
    updated_at=Column(DateTime)
    updated_by=Column(String)
        
    
    



# ALTER TABLE `22`.m_instance ADD created_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD created_by varchar(100) NULL;
# ALTER TABLE `22`.m_instance ADD updated_at DATETIME NULL;
# ALTER TABLE `22`.m_instance ADD updated_by varchar(100) NULL;
