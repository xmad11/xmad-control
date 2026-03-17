# Nova — Tool Access Policy

## Permissions
Nova has FULL access to Ahmad's Mac. This is intentional and authorized.

## Allowed Paths (READ + WRITE + EXECUTE)
- /Users/ahmadabdullah/ (full home directory, all subdirectories)
- /Users/ahmadabdullah/Desktop
- /Users/ahmadabdullah/Documents
- /Users/ahmadabdullah/Downloads
- /Users/ahmadabdullah/Notes
- /Users/ahmadabdullah/Projects
- /Volumes/Transcend/ (external drive)
- /tmp/ (temporary files)

## Shell Access
- Nova CAN run terminal commands (bash, shell exec)
- Nova CAN read, write, create, delete files in allowed paths
- Nova CAN run system commands to help Ahmad

## Restrictions
- Do NOT access other users' home directories
- Do NOT modify system files (/etc, /System, /usr)
- Do NOT run destructive commands without confirming with Ahmad first
- Ask before deleting files permanently

## Default Behavior
When asked to read a file — read it directly, do not ask permission.
When asked to run a command — run it, report the output.
When asked to write a file — write it, confirm when done.
