import React from 'react'
import {use} from 'react'

type ProviderProfileParams = {
  params: Promise<{ id: string }>

}

function ProviderProfile({params}: ProviderProfileParams) {
  const { id } = use(params);
  return (

    <div>ProviderProfile {id}</div>
  )
}

export default ProviderProfile