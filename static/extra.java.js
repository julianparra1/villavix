const consoleElement = document.getElementById('console');
        const messages = [
            "Accessing mainframe...",
            "Bypassing firewall...",
            "Decrypting passwords...",
            "Retrieving confidential files...",
            "Injecting trojan...",
            "Hack complete! Data extracted."
        ];
       
        function typeMessage(message, index = 0) {
            if (index < message.length) {
                consoleElement.innerHTML += message.charAt(index);
                setTimeout(() => typeMessage(message, index + 1), 50);
            } else {
                consoleElement.innerHTML += '<br>';
                addRandomMessage();
            }
        }
       
        function addRandomMessage() {
            let randomIndex = Math.floor(Math.random() * messages.length);
            setTimeout(() => typeMessage(messages[randomIndex]), 1000);
        }
       
        typeMessage("Initializing hacking sequence...");