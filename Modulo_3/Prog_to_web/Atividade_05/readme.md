4)
R- innerHTML - Retorna o texto, COM formatações e COM elementos html.        
R- textContent - Retorna o text COM formatações, mas sem os elementos html.

ex:
         
         //html 
         <div id="example">
          <p>Hello, world!</p>
         </div>
         
         //js
         
         const exampleDiv = document.querySelector('#example');
         console.log(exampleDiv.textContent); // "Hello, world!"
         console.log(exampleDiv.innerHTML); // "<p>Hello, world!</p>"

5)
R-
R-
