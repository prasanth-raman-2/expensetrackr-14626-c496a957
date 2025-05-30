#!/bin/bash
cd /home/kavia/workspace/code-generation/expensetrackr-14626-c496a957/expense_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

