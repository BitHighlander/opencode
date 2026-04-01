import z from "zod"
import { EOL } from "os"
import { NamedError } from "@opencode-ai/util/error"
import { logo as glyphs, art, tagline } from "./logo"

export namespace UI {
  export const CancelledError = NamedError.create("UICancelledError", z.void())

  export const Style = {
    TEXT_HIGHLIGHT: "\x1b[96m",
    TEXT_HIGHLIGHT_BOLD: "\x1b[96m\x1b[1m",
    TEXT_DIM: "\x1b[90m",
    TEXT_DIM_BOLD: "\x1b[90m\x1b[1m",
    TEXT_NORMAL: "\x1b[0m",
    TEXT_NORMAL_BOLD: "\x1b[1m",
    TEXT_WARNING: "\x1b[93m",
    TEXT_WARNING_BOLD: "\x1b[93m\x1b[1m",
    TEXT_DANGER: "\x1b[91m",
    TEXT_DANGER_BOLD: "\x1b[91m\x1b[1m",
    TEXT_SUCCESS: "\x1b[92m",
    TEXT_SUCCESS_BOLD: "\x1b[92m\x1b[1m",
    TEXT_INFO: "\x1b[94m",
    TEXT_INFO_BOLD: "\x1b[94m\x1b[1m",
  }

  export function println(...message: string[]) {
    print(...message)
    process.stderr.write(EOL)
  }

  export function print(...message: string[]) {
    blank = false
    process.stderr.write(message.join(" "))
  }

  let blank = false
  export function empty() {
    if (blank) return
    println("" + Style.TEXT_NORMAL)
    blank = true
  }

  export function logo(pad?: string) {
    const reset = "\x1b[0m"
    const green = "\x1b[32m"
    const gold = "\x1b[38;5;220m"
    const blue = "\x1b[38;5;39m"
    const dim = "\x1b[90m"
    const bold = "\x1b[1m"

    const result: string[] = []
    // Mountain art with colored ₿ (gold) and water ~ (blue)
    for (const line of art) {
      if (pad) result.push(pad)
      const colored = line
        .replace(/₿/g, `${gold}${bold}₿${reset}${green}`)
        .replace(/~([^~])/g, `${blue}~${reset}${green}$1`)
        .replace(/={2,}/g, (m) => `${blue}${m}${reset}${green}`)
      result.push(green + colored + reset)
      result.push(EOL)
    }
    // Tagline
    if (pad) result.push(pad)
    result.push(EOL)
    if (pad) result.push(pad)
    result.push(dim + " " + tagline + reset)
    result.push(EOL)
    if (pad) result.push(pad)
    result.push(dim + "                        ---Highlander" + reset)
    result.push(EOL)

    return result.join("").trimEnd()
  }

  export async function input(prompt: string): Promise<string> {
    const readline = require("readline")
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise((resolve) => {
      rl.question(prompt, (answer: string) => {
        rl.close()
        resolve(answer.trim())
      })
    })
  }

  export function error(message: string) {
    if (message.startsWith("Error: ")) {
      message = message.slice("Error: ".length)
    }
    println(Style.TEXT_DANGER_BOLD + "Error: " + Style.TEXT_NORMAL + message)
  }

  export function markdown(text: string): string {
    return text
  }
}
