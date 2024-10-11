const { program } = require('commander');
const fs = require('fs');

program
   .option('-i, --input <path>', 'шлях до файлу, який даємо для читання')
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

const data = fs.readFileSync(options.input, 'utf8')

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



if (options.output){
    fs.writeFileSync(options.output, formattedResult, 'utf8' )
    console.log(`Results are successfully saved into ${options.output}`);
}

