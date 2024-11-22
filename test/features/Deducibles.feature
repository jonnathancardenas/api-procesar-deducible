Feature: Procesar deducible

  Scenario Outline: Póliza con deducible texto plano
    Given la póliza tiene un deducible en forma del <texto>
    When ejecutamos el conversor de deducible
    Then obtenemos la parametrización del deducible en <detalle>

    Examples:
        | texto        | detalle        |
        | D22Request   | D22Response    |
        | D85Request   | D85Response    |
        | D10Request   | D10Response    |
        | D86Request   | D86Response    |
        | D88Request   | D88Response    |
        | D314Request  | D314Response   |
        | D1256Request | D1256Response  |
        | D6007Request | D6007Response  |
        | D5936Request | D5936Response  |
        | D4514Request | D4514Response  |
  