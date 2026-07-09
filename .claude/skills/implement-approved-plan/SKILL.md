# Skill
implement-approved-plan

# Purpose
Support governed structure-first work for the industrial platform.

# When To Use
Use when the requested workflow step matches this skill.

# Inputs
- Human request
- Relevant README, module.yaml, quality-gates.yaml, ADRs, and rules

# Steps
- Confirm scope and stage.
- Identify affected modules and risks.
- Do not implement unless this is implement-approved-plan with an approved plan.
- For analyze-backup-memory, do not analyze in this stage; require future explicit authorization and dedicated task.

# Outputs
- Summary
- Affected files
- Risks
- Required checks

# Failure Conditions
- Missing approval for critical work.
- Attempt to modify backup memory.
- False implementation claim.

# Return To Planning When
- Scope is unclear.
- Risks are unresolved.
- Required documentation or approval is missing.
