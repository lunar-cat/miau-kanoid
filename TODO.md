
## El problema de la detección de colisión es que debería detectar si entre la posición actual y la posición siguiente hay un overlap de x/y para detectar la colisión, porque de lo contrario puede ser que ahora mismo la posición actual no choque, y que la distancia sea de 2px, pero si la velocidad es de 4px, el próximo ya lo atravezará

## Agregar que la UI te diga si perdiste o ganaste

## debería pasar la current y next position, así veo si ahora y a futuro chocará
## insisto, necesitamos el side colliding para la plataforma del usuario, porque o si no la bola seguirá atravesando


## que tal si cambiamos el X,Y de un bloque, y que estos estén en el centro? y así simplemente vemos is colisiona arriba, abajo o a los lados
## y para ver si está chocando, sumamos la distancia del centro al borde más el radio de la bola, si eso es 0 o menos, pues colisión!
