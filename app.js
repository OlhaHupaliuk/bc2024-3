const {program} = require('commander');
const fs = require('fs');


program
   .requiredOption('-i, --input <path>', 'шлях до файлу, який даємо для читання')
   .option('-o, --output <path>', 'шлях до файлу, y якому записуємо результат')
   .option('-d, --display','результат має бути виведено у консоль');


program.parse(process.argv)
   
const options = program.opts();

function exit(message) {
   console.error(message);
   process.exit(1);
}

if (!options.input) {
    exit("Please, specify input file")
}

if (!fs.existsSync(options.input)){
    exit("Cannot find input file")
}

fs.readFile(options.input, 'utf8', (err, data) => {
    if (err){
        exit('Error')
    }
    try {
        const jsonData = JSON.parse(data);
        const result = JSON.stringify(jsonData, null, 2);

        const formattedResult = jsonData.map(item => {
            return `${item.exchangedate}:${item.rate}`;
        }).join('\n'); 
        

        if(options.display){
            console.log(result);
            console.log(formattedResult);
        }
        if(options.output){
            fs.writeFile(options.output, result, (err) => {
                if (err) {
                    exit("Err")
                }
                else{
                    console.log('Results are succesfully saved into file ' + options.output);
                }
            })
        }
    }
    catch (err){
        exit("Error during parsing json")
    }
});


