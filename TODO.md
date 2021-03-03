# Ideas
* Podría hacer que según si el movimiento del mouse es hacia la izquierda o hacia la derecha
eso permita que la velocidad de la bola sea x negativa, o xpositiva, así
permitiendo que el disparo inicial sea hacia la izquierda o derecha
podríamos calcularlo comparando los últimos 2 x del user mouse
## esto anterior debería poderse hacer con la nueva api del [mouse](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API)


* necesitamos reiniciar el juego cuando se mueve la bola, y restar vida, si no quedan vidas GG
* El tema de si colisiona a los lados y en qué punto la bola muere, deberíamos cambiarlo una vez cambiemos la plataforma, porque si le hacemos esquinas diagonales, sería un movimiento posiblemente útil, el cual tenemos que ver cómo funciona.

## El problema de la detección de colisión es que debería detectar si entre la posición actual y la posición siguiente hay un overlap de x/y para detectar la colisión, porque de lo contrario puede ser que ahora mismo la posición actual no choque, y que la distancia sea de 2px, pero si la velocidad es de 4px, el próximo ya lo atravezará

## Ok ya reacciona mejor, queda mejorar el rendimiento agregando el coso de que detecte 4 áreas grandes primero, y así pueda decidir entre revisar menos bloques
## Agregar UI también y ordenar las distintas razones de terminar el juego (perder o ganar)