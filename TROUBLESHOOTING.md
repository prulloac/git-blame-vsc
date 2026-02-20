# Git Blame Troubleshooting Guide

## Issue: Only seeing sample text, not git blame information

### Diagnostic Steps

1. **Verify you're in a git repository**
   - Check if the file is inside a folder with a `.git` directory
   - Run `git status` in the terminal - it should show git information
   - If you see "fatal: not a git repository", the file isn't tracked by git

2. **Check the Debug Console for logs**
   - When the extension is running (via `npm run watch` + F5):
   - Open: **View → Debug Console** (or press **Ctrl+Shift+Y**)
   - Click on a line in your editor
   - Look for these debug messages:
     ```
     Getting blame for: /path/to/file line: 5
     Blame output length: ...
     Parsed blame: { hash: '...', author: '...' }
     ```

3. **Verify git blame works manually**
   - Open terminal in your project folder
   - Run: `git blame path/to/file.js`
   - If it shows blame information (hash, author, date), git blame is working
   - If it fails or shows an error, check step 1

### Common Issues & Solutions

#### Issue: "No workspace folder found"
**Debug log shows:** `No workspace folder found for file: /path/to/file`

**Cause:** The file is not in any VS Code workspace

**Solution:** 
- Make sure you have a folder open in VS Code
- Add the folder to your workspace (File → Add Folder to Workspace)

#### Issue: "No git repository found"
**Debug log shows:** `No git repository found`

**Cause:** The file is in a folder that's not a git repository

**Solution:**
- Initialize git: `git init` in the project folder
- Or if it's already a git repo, make sure `.git` folder exists
- Reload VS Code window (Cmd+R or Ctrl+R)

#### Issue: "Failed to parse blame for line"
**Debug log shows:** `Failed to parse blame for line: 5` or `Regex did not match`

**Cause:** Blame output format doesn't match our regex pattern

**Solution:**
- Run `git blame filename` manually and show the first line
- The format should be: `<hash> (<author> <date> <time> <timezone>)`
- Example: `25418bf4 (John Doe 2024-02-20 10:30:45 +0000)`
- If it looks different, file a bug with the output

#### Issue: "No blame output received"
**Debug log shows:** `No blame output received` or `Blame output received: null`

**Cause:** The git blame command failed or returned no output

**Solution:**
- Check that the file has been committed to git
- Untracked or staged-only files won't have blame information
- Try: `git add filename` then `git commit` to make sure file has history

#### Issue: Blank author name
**Debug log shows:** `author: 'Unknown'`

**Cause:** Author information couldn't be parsed from the blame line

**Solution:**
- This is usually because the git username isn't set
- Set it: 
  ```bash
  git config user.name "Your Name"
  git config user.email "your@email.com"
  ```

### Enabling More Verbose Debugging

To see even more details:

1. Open `src/extension.ts`
2. Change `console.debug()` calls to `console.log()` in blameProvider.ts
3. Recompile: `npm run compile`
4. Reload the extension (Ctrl+R in extension window)
5. Check Debug Console again

### Still not working?

Check:
- [ ] File is in a git repository (has `.git` folder)
- [ ] File has been committed (not just staged)
- [ ] Git is installed and working (`git --version`)
- [ ] VS Code's git extension is enabled (shouldn't be disabled)
- [ ] Debug Console shows debug messages (means code is running)
- [ ] Manual `git blame filename` works in terminal

### Debug Console Output Examples

**Successful blame fetch:**
```
Getting blame for: /home/user/project/src/index.js line: 5
Repo root: /home/user/project
File path: /home/user/project/src/index.js
Relative path: src/index.js
Fetching blame output for: src/index.js
Blame output received: 3214 chars
Total lines in blame output: 48
Looking for line number: 5
Parsing blame line: 25418bf4 (John Doe 2024-02-20 10:30:45 +0000)  5) console.log(...
Regex matched!
Parsed - hash: 25418bf4 author: John Doe date: 2024-02-20 10:30:45 +0000
Got commit: Add git blame support
```

**Non-git file:**
```
No workspace folder found for file: /tmp/scratch.js
```

**File in git repo but not committed:**
```
Repo root: /home/user/project
File path: /home/user/project/new-file.js
Relative path: new-file.js
Fetching blame output for: new-file.js
Error getting blame output: Error: ... (file hasn't been committed)
```
