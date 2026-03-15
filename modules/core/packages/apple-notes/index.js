/**
 * Apple Notes Bridge Module
 * Access Apple Notes via AppleScript
 */

const { exec } = require("node:child_process")

class AppleNotes {
  async listFolders() {
    const script = `
      tell application "Notes"
        get name of every folder
      end tell
    `
    return this.executeScript(script)
  }

  async listNotes(folderName) {
    const script = `
      tell application "Notes"
        get name of every note in folder "${folderName}"
      end tell
    `
    return this.executeScript(script)
  }

  async getNoteContent(folderName, noteName) {
    const script = `
      tell application "Notes"
        set theNote to note "${noteName}" in folder "${folderName}"
        get body of theNote
      end tell
    `
    return this.executeScript(script)
  }

  async createNote(folderName, title, body) {
    const script = `
      tell application "Notes"
        set newNote to make new note at folder "${folderName}" with properties {name:"${title}", body:"${body}"}
      end tell
    `
    return this.executeScript(script)
  }

  executeScript(script) {
    return new Promise((resolve, reject) => {
      const escaped = script.replace(/"/g, '\\"')
      exec(`osascript -e "${escaped}"`, (error, stdout) => {
        if (error) reject(error)
        else resolve(stdout.trim())
      })
    })
  }
}

module.exports = AppleNotes
