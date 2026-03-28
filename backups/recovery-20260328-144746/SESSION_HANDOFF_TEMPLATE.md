# SESSION HANDOFF TEMPLATE

## Continuation rules
This project must continue from the existing protected local repository and repo-resident documentation only.

## Non-negotiable working rules
1. Do not rush into code changes
2. Do not perform broad rewrites
3. Do not replace or mutate working structures aggressively
4. Do not improvise architecture outside the documented blueprint
5. Do not use any implementation source outside the current repo
6. Do not deploy or edit in AWS first, local repo is source of truth
7. Before any meaningful code change, require a checkpoint
8. Prefer the smallest safe step over the fastest big step

## Required start-of-session sequence
1. Confirm working directory
2. Confirm current branch
3. Confirm latest commit
4. Confirm latest milestone tag(s)
5. Read PROJECT_RULES.md
6. Read PROJECT_BLUEPRINT.md
7. Read CURRENT_PROJECT_STATE.md
8. Summarize current protected state
9. Propose the next smallest safe step
10. Wait for execution of that step before moving on

## Required safety workflow
- One command block at a time
- Visible START/END terminal markers
- Checkpoint before major changes
- Push to origin/main after meaningful changes
- Tag major milestones
- Never bypass the guardrails because of urgency

## Definition of success
- Stable, modular progress
- No hacking
- No mutation-driven shortcuts
- No scattered sidebar or route wiring
- No code loss
- No broad destructive edits
