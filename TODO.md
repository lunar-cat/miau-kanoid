# Ideas
* Podría hacer que según si el movimiento del mouse es hacia la izquierda o hacia la derecha
eso permita que la velocidad de la bola sea x negativa, o xpositiva, así
permitiendo que el disparo inicial sea hacia la izquierda o derecha
podríamos calcularlo comparando los últimos 2 x del user mouse
## esto anterior debería poderse hacer con la nueva api del [mouse](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API)
* El user debería ser creado como la bola igual
* El juego debería crearlos a ambos
* necesitamos reiniciar el juego cuando se mueve la bola, y restar vida, si no quedan vidas GG
* El tema de si colisiona a los lados y en qué punto la bola muere, deberíamos cambiarlo una vez cambiemos la plataforma, porque si le hacemos esquinas diagonales, sería un movimiento posiblemente útil, el cual tenemos que ver cómo funciona.
* ahora que lo pienso, con la nueva API DEL MOUSE, como no solamente te da la coordenada actual, si no que también te da el movimiento en negativo o positivo, eso nos permitiría saber si estás moviéndote de izquierda a derecha, y condicionar lo positivo o negativo del movimiento horizontal de la bola

## El problema de la detección de colisión es que debería detectar si entre la posición actual y la posición siguiente hay un overlap de x/y para detectar la colisión, porque de lo contrario puede ser que ahora mismo la posición actual no choque, y que la distancia sea de 2px, pero si la velocidad es de 4px, el próximo ya lo atravezará