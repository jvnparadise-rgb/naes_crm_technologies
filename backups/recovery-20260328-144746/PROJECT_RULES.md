# PROJECT RULES

## Implementation boundary
This project is custom-built in this repository only.

## Source of truth
Only files in this repository may be used as implementation source.

## Workflow
1. Work locally
2. Checkpoint before major changes
3. Commit frequently with clear messages
4. Tag major milestones
5. Push to remote when configured

## Safety rule
Before any major refactor, deployment change, schema change, auth change, or routing change:
- git status
- git add -A
- git commit -m "checkpoint: <clear message>"

## Deployment rule
Only deploy artifacts built from this repository.
