Make sure Neo4j is running first, from this directory:

```
docker-compose up
```

### Run a Workflow

```

npm run build

npm run transmute -- \
data create \
--type "WorkflowInstance" \
--input "https://w3id.org/traceability/#e-commerce" \
--variables '{"workflow":{"definition":["123"],"instance":["000"]}}' \
--output "./data/workflows/workflow.instance-0.json"

```

### Import Workflow Instance

```
npm run build

npm run transmute -- \
neo workflow import \
--clean \
--uri "neo4j://localhost" \
--user "neo4j" \
--password "test" \
--input "./data/workflows/workflow.instance-0.json"

```

<img src="./workflow-instance.png"/>
