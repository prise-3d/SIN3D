<template>
  <v-flex xs12>
    <div style="margin-top:10%">
      <p style="font-size: 1.4em;">Si vous souhaitez être informé des résultats non nomminatifs de ces recherches vous pouvez, sans obligation, laisser votre adresse mail, elle ne sera utilisée que pour vous permettre d'accéder aux résultats de l'étude une fois analysés.</p>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Votre adresse email"
        required
      />

      <v-btn @click="addNewsletter" color="success" large>Valider mon adresse</v-btn>
    </div>

    <div class="text-center">
      <v-dialog
        v-model="dialogError"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline lighten-2"
            primary-title
          >
            <p style="font-size:0.8em;">L'adresse email saisie n'est pas correcte.</p>
          </v-card-title>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="#DF0101"
              text
              @click="dialogError = false"
            >
              Fermer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="text-center">
      <v-dialog
        v-model="dialogSuccess"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline lighten-4"
            primary-title
          >
            <p style="font-size:0.8em;">Votre adresse email a bien été ajoutée à la newsletter.</p>
          </v-card-title>
          <!-- <v-card-text>
          </v-card-text> -->

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              text
              @click="dialogSuccess = false"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-flex>
</template>

<script>
import { NEWS as newsletter } from '@/../config.messagesId'
import { mapActions } from 'vuex'

export default {
  name: 'Newsletter',
  data() {
    return {
      emailRules: [
        v => !!v || 'L\'adresse email est obligatoire',
        v => /.+@.+/.test(v) || 'L\'email doit être valide'
      ],
      email: '',
      dialogError: false,
      dialogSuccess: false
    }
  },
  methods: {
    ...mapActions(['sendMessage', 'checkExistData']),

    async addNewsletter() {
      // need to check if mail is already there or not
      const data = {
        msgId: newsletter,
        msg: {
          experimentName: this.experimentName,
          sceneName: this.sceneName,
          userEmail: this.email
        }
      }

      if (this.validEmail(this.email)) {
        const findDoc = await this.checkExistData(data)

        console.log(findDoc)

        if (findDoc === 204) {
          console.log('Create new email input')
          this.sendMessage(data)
          this.dialogSuccess = true
        }
      }
      else {
        this.dialogError = true
      }
    },
    validEmail: function (email) {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  }
}
</script>
