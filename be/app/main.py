import logging
from fastapi import FastAPI
from .routes import router

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("=" * 80)
logger.info("Starting FastAPI Quiz Application")
logger.info("=" * 80)

app = FastAPI()

logger.info("FastAPI app instance created")
logger.info("Including router...")

app.include_router(router)

logger.info("Router included successfully")
logger.info("Application initialization complete")
logger.info("=" * 80)

@app.on_event("startup")
async def startup_event():
    logger.info("=" * 80)
    logger.info("APPLICATION STARTUP EVENT")
    logger.info("=" * 80)

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("=" * 80)
    logger.info("APPLICATION SHUTDOWN EVENT")
    logger.info("=" * 80)
