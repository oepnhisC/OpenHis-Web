<template>
    <div>
        <v-card title="数据" flat>
            <!-- <template v-slot:text>
                <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                    hide-details single-line></v-text-field>
            </template> -->

            <v-data-table :headers="headers" :items="desserts" :search="search"></v-data-table>
        </v-card>
    </div>
</template>

<script>
  export default {
    name: 'ShouFei',

    data () {
      return {
        search: '',
        headers: [
          {align: 'start',key: 'name',sortable: false,title: 'Dessert (100g serving)'},
          { key: 'calories', title: '你好' },
          { key: 'fat', title: 'Fat (g)' },
          { key: 'carbs', title: 'Carbs (g)' },
          { key: 'protein', title: 'Protein (g)' },
          { key: 'iron', title: 'Iron (%)' },
        ],
        desserts: [
          {name: 'Frozen Yogurt',calories: 159,fat: 6.0,carbs: 24,protein: 4.0,iron: 1,},
          {name: 'Ice cream sandwich',calories: 237,fat: 9.0,carbs: 37,protein: 4.3,iron: 1,},
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: 7,
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: 8,
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: 16,
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: 0,
          },
 

        ],
      }
    },
  }
</script>