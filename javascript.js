const app = Vue.createApp({
    data() {
        return {
            data: {},
            textAreaData: "",
            promptText: ""
        }
    },
    created(){
        this.data.app_title = this.getJsonData() || "App";
    },
    methods: {
        getJsonData(){
            fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.data = data;
            })
            .catch(error => {
                console.error('Hubo un error al leer el archivo JSON:', error);
            });
        },
        formatText(){
            const lines = this.textAreaData.split("\n");
            let keyWords = []

            lines.forEach((line) => {
                if(line.trim() === '') return; // Remueve las lineas vacías.

                const words = line.split(' ');
                var cleanLine = ""
                words.forEach((word) => {
                    // '[?()]' indica que remplazará todos los ?,( y ) por ''.
                    cleanWord = word.replace(/[?()]/g, '').trim(); // trim es para eliminar espacios

                    // los '/' indican el inicio y término de la cadena.
                    // '^' indica que buscará desde el inicio de la cadena.
                    // '[0-9]' indica que será un dígito entre el 0 al 9.
                    // '{1,}' indica que puede ser de 1 o mas digitos.
                    // '\.' indica que habrá un punto.
                    // '?' indica que es opcional.
                    // keyWords = keyWords.filter(word => word.match(/^[0-9]{1,}\.?[0-9]{1,}?/));
                    if(cleanWord !== '' && !cleanWord.match(/^[0-9]{1,}\.?[0-9]{1,}?/)){
                        if(cleanLine === ''){
                            cleanLine = cleanWord;
                        }else{
                            cleanLine = cleanLine + " " + cleanWord;
                        }
                    }
                });

                keyWords.push(cleanLine);
            });

            // Remueve elementos repetidos.
            keyWords = keyWords.filter((item, index) => {
                return keyWords.indexOf(item) === index;
            });

            this.promptText = keyWords.join(', ');
        }
    }
})

app.mount('#app')