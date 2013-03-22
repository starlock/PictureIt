import redis

# redis connection
redis_connection = redis.from_url("redis://localhost:6379/", 0)
