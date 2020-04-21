<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-card>
        <v-container fluid fill-height>
          <v-layout column align-center>
            <v-card-title class="headline d-block text-md-center font-weight-bold">GDPR notice</v-card-title>

            <v-card-text>
              <!-- eslint-disable -->
<h2>Collected data and their usage</h2>
<p>Here is a summary of every data that is collected.<br>
This website's main goal is to collect data as part of public research. By using it, you consent to every data collection during its usage.</p>
<v-data-table
  :headers="collectedHeaders"
  :items="collected"
  hide-actions
  class="mb-5"
>
  <template v-slot:items="props">
    <td v-html="props.item.data" />
    <td v-html="props.item.usage" />
  </template>
</v-data-table>


<h1>Privacy Policy for ULCO</h1>


<p>At LISIC, accessible from <a href="https://diran.univ-littoral.fr">https://diran.univ-littoral.fr</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by LISIC and how we use it.</p>

<p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at direction [at] lisic.univ-littoral.fr</p>

<h2>General Data Protection Regulation (GDPR)</h2>
<p>We are a Data Controller of your information.</p>

<p>ULCO legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect the information:</p>
<ul>
  <li>ULCO needs to perform a contract with you</li>
  <li>You have given ULCO permission to do so</li>
  <li>Processing your personal information is in ULCO legitimate interests</li>
  <li>ULCO needs to comply with the law</li>
</ul>
  
<p>ULCO will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p> 

<p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please contact us.</p>
<p>In certain circumstances, you have the following data protection rights:</p>
<ul>
  <li>The right to access, update or to delete the information we have on you</li>
  <li>The right of rectification.</li> 
  <li>The right to object</li>
  <li>The right of restriction</li>
  <li>The right to data portability</li>
  <li>The right to withdraw consent</li>
</ul>

<h2>Collected data and their usage</h2>
<p>Here is a summary of every data that is collected.<br>
This website's main goal is to collect data as part of public research. By using it, you consent to every data collection during its usage.</p>
<v-data-table
  :headers="collectedHeaders"
  :items="collected"
  hide-actions
  class="mb-5"
>
  <template v-slot:items="props">
    <td v-html="props.item.data" />
    <td v-html="props.item.usage" />
  </template>
</v-data-table>


<h2>Log Files</h2>

<p>LISIC follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>

<h2>Cookies and Web Beacons</h2>

<p>Like any other website, LISIC uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to identify each user by a unique, and random, identifier, as part of the research experiments.</p>


<h2>Children's Information</h2>

<p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>

<p>LISIC does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>

<h2>Online Privacy Policy Only</h2>

<p>Our Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in LISIC. This policy is not applicable to any information collected offline or via channels other than this website.</p>

<h2>Consent</h2>

<p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
             <!-- eslint-enable -->
            </v-card-text>

            <v-btn color="primary" @click="setGdprValidated">I consent to this privacy policy</v-btn>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'GdprNotice',
  data() {
    return {
      collectedHeaders: [
        {
          text: 'Collected data',
          align: 'left',
          sortable: false,
          value: 'data'
        },
        { text: 'Usage',
          sortable: false,
          align: 'left',
          value: 'usage'
        }
      ],
      collected: [ /* eslint-disable */
{
data: `IP address`,
usage: `We make demographic statistics on who is doing the experiments`
},
{
data: `Unique and anomymous identifier`,
usage: `When using the app, you are identified by a unique and anonymous identifier.<br>
This helps us differentiate users when analyzing the collected data.`
},
{
data: `Experiments data`,
usage: `When doing an experiment, a lot of data is collected. This may include the following:
<ul>
  <li>Exact timestamp of the experiment start</li>
  <li>Clicks positions on the page</li>
  <li>Page elements that were selected</li>
  <li>Exact timestamp of the click</li>
  <li>Exact timestamp of the experiment validation</li>
  <li>List of validated experiments, with its progression through the list of available scenes</li>
</ul>`
}
      ] /* eslint-enable */
    }
  },
  methods: {
    ...mapActions(['setGdprValidated'])
  }
}
</script>
