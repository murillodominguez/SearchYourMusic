document.querySelector('#submit').addEventListener('click', consulta);
        document.querySelector('#form').addEventListener('keydown', function (e) {
            if (event.keyCode === 13) {
                e.preventDefault();
                consulta();
            }
        });
        async function consulta() {
            //resultado
            let results = document.querySelector(".results");
            //declaração do headers para api
            const optionsDeezer = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'f6e8163808mshc9b6d0993961b60p12e3abjsn4a2d5433e2bb',
                    'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
                }
            };

            //pega o valor da pesquisa
            let song = document.querySelector('#GET-song').value;
            console.log(song);

            //busca o valor da pesquisa na api
            let resposta = await fetch('https://deezerdevs-deezer.p.rapidapi.com/search?q=' + song, optionsDeezer)
                .then(response => response.json())
                .catch(err => console.error(err));
            console.log(resposta);

            //se não encontrar na api do deezer, vai no iTunes
            if (resposta.total == 0) {
                const urlItunes = new URL('https://itunes.apple.com/search');
                const paramsItunes = { term: pesquisa, media: 'music', country: 'br' }
                let cors = "https://cors-anywhere.herokuapp.com/";
                urlItunes.search = new URLSearchParams(paramsItunes);
                let resposta = await fetch(cors + urlItunes)
                    .then(response => response.json())
                console.log(resposta);

                //coleta e blob da imagem no iTunes 
                let imagemData = await fetch(resposta.results[0].artworkUrl100);
                let imagemDataURL = imagemData.url;
                imagemDataURL = imagemDataURL.replace("/100x100", "/1000x1000");
                imagemData = await fetch(imagemDataURL);
                let imagem = await imagemData.blob();
                const imageObjectURL = URL.createObjectURL(imagem);
                let img = document.createElement('img');
                img.setAttribute("class", "cover");
                img.setAttribute("alt", "album artwork");
                img.src = imageObjectURL;
                results.appendChild(img);

                //coleta informações adicionais da api Deezer
                let info = resposta.data[0].artist.name;
                info = info + " - " + resposta.data[0].album.title;
                document.querySelector(".infoTexto").innerHTML = info;
            }

            //vai no deezer mesmo

            else {
                //coleta e blob da imagem no deezer
                let imagemData = await fetch(resposta.data[0].album.cover_xl);
                let imagem = await imagemData.blob();
                const imageObjectURL = URL.createObjectURL(imagem);
                let img = document.createElement('img');
                img.setAttribute("class", "cover");
                img.setAttribute("alt", "album artwork");
                img.src = imageObjectURL;
                results.appendChild(img);


                // coleta informações adicionais da api Deezer
                let info = resposta.data[0].artist.name;
                info = info + " - " + resposta.data[0].album.title;
                document.querySelector(".infoTexto").innerHTML = info;
            }

            //limpa as imagens a cada pesquisa removendo as imagens anteriores
            if (document.querySelectorAll('.cover').length > 0) {
                while (document.querySelectorAll('.cover').length !== 1) {
                    document.querySelector(".cover").remove();
                }
            }
        }
