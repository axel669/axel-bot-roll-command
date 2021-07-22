const diceRegex = /((?<sign>\-|\+)?\s*)((?<count>\d+)?d(?<size>\d+)|(?<modifier>\d+))/g

const sum = (total = 0, num) => total + num
const rollDie = (size) => Math.floor(Math.random() * size) + 1
const rollDice = (info) => {
    const {sign = "+", count, size, keep, modifier} = info

    if (modifier !== undefined) {
        return {
            sign,
            rolls: [parseInt(modifier, 10)]
        }
    }

    const dieCount = parseInt(count ?? "1", 10)
    const dieSize = parseInt(size, 10)
    const rolls = Array
        .from(
            {length: dieCount},
            () => rollDie(dieSize)
        )

    return {
        sign,
        rolls,
    }
}

const command = (commandInfo) => {
    const {user, settings, parts, say} = commandInfo
    const username = user["display-name"]
    if (parts.length === 0) {
        send(`@${username} throw me a frickin die here`)
    }

    const rollInfo = Array.from(
        parts
            .join(" ")
            .matchAll(diceRegex),
        (match) => match.groups
    )

    const rolls = rollInfo.map(rollDice)

    const diceResults = rolls
        .map(
            (result) =>
                `${result.sign}[${result.rolls.join(", ")}]`
        )
        .join("")
    const total = rolls
        .map(
            (result) => {
                const value = result.rolls.reduce(sum)

                if (result.sign === "-") {
                    return -value
                }
                return value
            }
        )
        .reduce(sum)
    console.log("rolled", total)

    say(
        `@${username} rolled ${total} (${diceResults})`
    )
}

export default command
