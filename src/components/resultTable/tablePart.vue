<template>
    <thead>
        <tr>
        <th class="cell" rowspan="2">Задолженность</th>
        <th class="cell" colspan="3">Период просрочки</th>
        <th class="cell" rowspan="2">Ставка</th>
        <th class="cell" rowspan="2">Доля <br>ставки</th>
        <th class="cell" rowspan="2">Формула</th>
        <th class="cell" rowspan="2">Пени</th>
        </tr>
        <tr>
        <th class="cell">с</th>
        <th class="cell">по</th>
        <th class="cell">дней</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td class="cell">6 876 876,00</td>
        <td class="cell">07.09.2022</td>
        <td class="cell">24.09.2022</td>
        <td class="cell">18</td>
        <td class="cell">7,50 %</td>
        <td class="cell">0</td>
        <td class="cell">6 876 876,00 x 18 x 0 x 7.5%</td>
        <td class="cell">0,00 р</td>
        </tr>
    </tbody>
    <div style="height: 3rem"></div>

</template>


<script>

export default {
    name: 'tablePart',
    props: ['item'],
}

</script>