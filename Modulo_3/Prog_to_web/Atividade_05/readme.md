4 )

R- innerHTML - Retorna o texto, COM formatações e COM elementos html.        
R- textContent - Retorna o text COM formatações, mas sem os elementos html.

ex:
         
         //html 
         <div id="examplo">
          <p>Hello, world!</p>
         </div>
         
         //js
         
         const exampleDiv = document.querySelector('#examplo');
         console.log(exampleDiv.textContent); // "Hello, world!"
         console.log(exampleDiv.innerHTML); // "<p>Hello, world!</p>"

5 )

R-       
        
         //html 
          <div id="exemplo">
           <p>Hello, world!</p>
          </div>
         
          //js
         
          const hello = document.getElementById('exemplo')
          hello.style.color = 'blue';
          

6 )
 está no arquivo: 'teste.html'
