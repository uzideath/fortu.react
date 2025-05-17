import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@/hooks/useAuth'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@/types'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    if (!isLoading && !user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    }
  }, [isLoading, user])

  if (isLoading || !user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#033e93" />
      </View>
    )
  }

  return <>{children}</>
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ProtectedRoute
