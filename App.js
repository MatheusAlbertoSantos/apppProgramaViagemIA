import { useState } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'

const statusBarHeight = StatusBar.currentHeight
const KEY = 'COLOQUE SUA KEY AQUI!!!!'

export default function App() {

  const [loading, setLoading] = useState(false)
  const [roteiroViagem, setRoteiroViagem] = useState("")
  
  const [cidade, setCidade] = useState("")
  const [numeroDias, setNumeroDias] = useState(1)

  async function handleGerar() {
    if(cidade === ""){
      Alert.alert("Preencha o nome da cidade!")
      return
    }

    setLoading(true)
    Keyboard.dismiss()

    const texto = `Crie um roteiro para uma viagem de exatos ${numeroDias.toFixed(0)} dias na cidade de ${cidade}, busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'user',
            content: texto
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      setLoading(false)
    })

  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor='#a0a0a0' />
      <Text style={styles.head} >Roteiros Viagem</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Cidade destino</Text>
        <TextInput 
          placeholder='Ex: Natal, Rio Grande do Norte'
          style={styles.input}
          valur={cidade}
          onChangeText={(text) => setCidade(text)}
        />
        <Text style={styles.label}>Tempo de estadia: <Text style={styles.days}> {numeroDias.toFixed(0)} </Text> dias</Text>

        <Slider 
          minimumValue={1}
          maximumValue={10}
          minimumTrackTintColor='#b34db2'
          maximumTrackTintColor='#000000'
          value={numeroDias}
          onValueChange={(dias) => setNumeroDias(dias)}
        />
      </View>

      <Pressable style={styles.button} onPress={handleGerar}>
        <Text style={styles.buttonText}>Gerar Roteiro </Text>
        <MaterialIcons name='travel-explore' size={24} color='#fff' />
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 5 }} style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        {
          loading && (
            <View style={styles.content}>
              <Text style={styles.title}>Carregando Roteiro...</Text>
              <ActivityIndicator color="#000" size="large" />
            </View>
          )
        }
        {
          roteiroViagem && (
            <View style={styles.content}>
              <Text style={styles.title}>Roteiro da sua viagem</Text>
              <Text>{roteiroViagem}</Text>
            </View>
          )
        }
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a0a0a0',
    alignItems: 'center',
    paddingTop: 20
  },
  head: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 55
  },
  form: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94ab8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16
  },
  days: {
    backgroundColor: '#f1f1f1',
  },
  button: {
    backgroundColor: '#b34db2',
    width: '90%',
    flexDirection: 'row',
    borderRadius: 8,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#fff',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  contentScroll: {
    width: '90%',
    marginTop: 10
  }
});
