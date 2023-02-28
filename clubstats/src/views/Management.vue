<template>
  <div v-if="this.$store.getters.user === null">
    <MissingRole></MissingRole>
  </div>
  <div v-else>
    <v-tabs flat>
      <v-tab>
        Clubs
      </v-tab>
      <v-tab-item>
        <ClubTable/>
      </v-tab-item>
      <v-tab>
        Users
      </v-tab>
      <v-tab-item>
        <UserTable />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import MissingRole from '@/components/MissingRole';
import ClubTable from '@/components/ClubTable';
import UserTable from '@/components/UserTable';

export default {
  name: 'management-view',
  data() {
    return {
    }
  },
  components: {
    MissingRole,
    ClubTable,
    UserTable
  },
}
</script>