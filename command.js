(user, parts) => {
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

    send(
        `@${username} rolled ${total} (${diceResults})`
    )
}
