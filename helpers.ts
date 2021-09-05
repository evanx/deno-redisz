import * as Colors from "https://deno.land/std/fmt/colors.ts";
import { printInfoFooter, printInfoHeader } from "./utils.ts";

const helpLink = "https://github.com/evanx/deno-redisz";

export function exitWithErrorText(text: string) {
  printInfoHeader(text);
  printInfoFooter(`See ${helpLink}`);
  Deno.exit(1);
}

export function formatMember(
  member: string,
  score: string,
  options = { colorize: true },
) {
  const columns = formatColumns(member, score);
  if (options.colorize) {
    columns[0] = Colors.cyan(columns[0]);
    columns[1] = Colors.white(columns[1]);
    if (columns[2]) {
      columns[2] = Colors.gray(columns[2]);
    }
  }
  return columns.join(" ");
}

function formatColumns(
  member: string,
  score: string,
) {
  const columns = [];
  columns.push(member);
  columns.push(score);
  if (/^1[6-9][0-9]{11}$/.test(score)) {
    columns.push((new Date(parseInt(score))).toISOString());
  }
  return columns;
}
