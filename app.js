const { program } = require('commander');
const fs = require('fs');

program
   .requiredOption('-i, --input <path>', 'шлях до файлу, який даємо для читання')
   .option('-o, --output <path>', 'шлях до файлу, y якому записуємо результат')
   .option('-d, --display', 'результат має бути виведено у консоль');

program.parse(process.argv);

const options = program.opts();

function exit(message) {
   console.error(message);
   process.exit(1);
}

if (!options.input) {
    exit("Please, specify input file");
}

if (!fs.existsSync(options.input)) {
    exit("Cannot find input file");
}

fs.readFile(options.input, 'utf8', (err, data) => {
    if (err) {
        exit('Error reading file');
    }
    try {
        // Парсимо json дані з файлу
        const jsonData = JSON.parse(data);

        // Форматуємо дані у вигляді дата:курс
        const formattedResult = jsonData.map(item => {
            return `${item.exchangedate}:${item.rate}`;
        }).join('\n'); 

        // Виводимо у консоль
        if (options.display) {
            console.log(formattedResult);
        }

        // Записуємо у файл
        if (options.output) {
            fs.writeFile(options.output, formattedResult, (err) => {
                if (err) {
                    exit("Error writing to file");
                } else {
                    console.log(`Results are successfully saved into ${options.output}`);
                }
            });
        }
    } catch (err) {
        exit("Error during parsing JSON");
    }
});
