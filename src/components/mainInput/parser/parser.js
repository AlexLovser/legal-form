import parseMoney from "parse-money";
import { DateTime } from "luxon";


function toISO(date) {
    return date.split('.').reverse().join('-');
}

function createDebt(start, amount) {
    return {
        debt_start: DateTime.fromISO(toISO(start)).toISO(),
        amount: amount,
    };
}

function createPayment(start, amount) {
    return {
        payment_date: DateTime.fromISO(toISO(start)).toISO(),
        amount: amount,
        payment_for: '',
    };
}

function parseDate(date) {
    const formats = [
        'LLLL yyyy', 'LLLL yy', 'LLL yy', 'LLL yyyy', 'dd.MM.yyyy', 'dd.MM.yy',
        'LLLL.yyyy', 'LLLL.yy', 'LLL.yy', 'LLL.yyyy', 'MM.yyyy', 'MM.yy'
    ];

    const shortMonthMap = [
        {
            source: 'фев.',
            dest: 'февр.'
        },
        {
            source: 'мар.',
            dest: 'март.'
        },
        {
            source: 'июн.',
            dest: 'июнь.'
        },
        {
            source: 'июл.',
            dest: 'июль.'
        },
        {
            source: 'сен.',
            dest: 'сент.'
        },
        {
            source: 'ноя.',
            dest: 'нояб.'
        },
        {
            source: 'фев ',
            dest: 'февр '
        },
        {
            source: 'мар ',
            dest: 'март '
        },
        {
            source: 'июн ',
            dest: 'июнь '
        },
        {
            source: 'июл ',
            dest: 'июль '
        },
        {
            source: 'сен ',
            dest: 'сент '
        },
        {
            source: 'ноя ',
            dest: 'нояб '
        }
    ];

    let value;
    let tmp = date.toLowerCase();
    for (const month of shortMonthMap) {
        if (tmp.search(month.source) > -1) {
            tmp = tmp.replace(month.source, month.dest);
        }
    }
    let format = 'dd.MM.yyyy';
    for (const f of formats) {
        value = DateTime.fromFormat(tmp, f);
        if (value.isValid) {
            format = f;
            break;
        }
    }
    if (value.isValid) {
        if (!DateTime.fromFormat(tmp, format).isValid) {
            return value.set({ day: value.daysInMonth }).toFormat('dd.MM.yyyy');
        }
        return value.toFormat('dd.MM.yyyy');
    }
    return null;
}

export function fromClipboardFormat(data) {
    const debts = [];
    const payments = [];
    const rawRows = data.split('\n');
    for (const row of rawRows) {
        const item = row.trim().split('\t');
        if (item.length < 2 || item.length > 4) {
            continue;
        }
        // Первым элементом всегда идет дата. Она может иметь формат дд.мм.гггг или состоять
        // из 2 частей - месяц и год
        let parsedDate = parseDate(item[0]);
        if (!parsedDate) {
            parsedDate = parseDate(`${item[0]}; ${item[1]};`);
            item.splice(1, 1);
        }
        if (!parsedDate) {
            continue;
        }
        item[0] = parsedDate;
        // Начисления
        if (item.length === 2) {
            if (!item[1]) {
                continue;
            }
            const amountAsString = item[1].replace(/\s/g, '');
            let amount = parseMoney(amountAsString).amount;
            if (amountAsString[0] === '-') {
                amount *= -1;
            }
            debts.push(createDebt(item[0], amount));
            continue;
        }
        if (item.length !== 3) {
            continue;
        }
        // Пропускаем некорректные строки
        if (item[1].trim() === '' && item[2].trim() === '') {
            continue;
        }
        // Если в одной строке и платеж и начисление - делаем 2 строки
        const debtAsString = item[1] !== '' ? item[1].replace(/\s/g, '') : '0.0';
        const paymentAsString = item[2] !== '' ? item[2].replace(/\s/g, '') : '0.0';
        let debt = parseMoney(debtAsString).amount;
        let payment = parseMoney(paymentAsString).amount;
        if (debtAsString[0] === '-') {
            debt *= -1;
        }

        if (paymentAsString[0] === '-') {
            payment *= -1;
        }
        if (debt !== 0.0 && payment !== 0.0) {
            payments.push(createPayment(item[0], payment));
            debts.push(createDebt(item[0], debt));
            continue;
        }
        // Платеж
        if (debt !== 0.0) {
            debts.push(createDebt(item[0], debt));
        } else if (payment !== 0.0) {
            // Начисление
            payments.push(createPayment(item[0], payment));
        }
    }
    return {
        payments: payments,
        debts: debts
    };
}