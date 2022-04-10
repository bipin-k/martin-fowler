function amountFor(aPerformance, play) {
    let result = 0;
    switch (play.type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return result;
}

function playFor(plays, aPerformance) {
    return plays[aPerformance.playID];
}

function volumeCreditsFor(plays, aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(plays, aPerformance).type) {
        result += Math.floor(aPerformance.audience / 5);
    }
    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber);
}

function totalVolumeCredits(plays, invoice) {
    let result = 0;
    for (let perf of invoice.performances) {
        result += volumeCreditsFor(plays, perf);
    }
    return result;
}

function totalAmount(invoice, plays) {
    let result = 0;
    for (let perf of invoice.performances) {
        result += amountFor(perf, playFor(plays, perf));
    }
    return result;
}

function statement(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        result += ` ${playFor(plays, perf).name}: ${usd(amountFor(perf, playFor(plays, perf))/100)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(totalAmount(invoice, plays)/100)}\n`;
    result += `You earned ${totalVolumeCredits(plays, invoice)} credits\n`;
    return result;
}

module.exports = statement;
