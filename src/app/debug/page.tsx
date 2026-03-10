"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
  const [status, setStatus] = useState('Checking...')
  const [error, setError] = useState('')
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').single()
      
      if (error) {
        setError(`Database error: ${error.message}`)
        setStatus('❌ Connection Failed')
      } else {
        setStatus('✅ Connected to Supabase')
        
        // Check if tables exist
        const { data: tableData } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
        
        if (tableData) {
          setTables(['profiles', 'courses', 'cohorts', 'enrollments', 'progress'])
        }
      }
    } catch (err) {
      setError(`Connection error: ${err}`)
      setStatus('❌ Connection Failed')
    }
  }

  const runSchema = async () => {
    setStatus('🔄 Running schema...')
    
    // This would normally be done in Supabase SQL Editor
    alert('Please run the schema.sql file in your Supabase SQL Editor first!')
    
    setStatus('⏳ Waiting for schema to be applied...')
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-amber-500">MUI Portal Debug</h1>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <p className="text-lg">{status}</p>
            {error && (
              <div className="bg-red-900 border border-red-800 rounded p-3">
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>

        {tables.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tables Found</h2>
            <ul className="space-y-1">
              {tables.map(table => (
                <li key={table} className="text-green-400">✅ {table}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 mb-2">1. Run the database schema:</p>
              <ol className="text-sm text-gray-400 ml-4 space-y-1">
                <li>• Go to your Supabase project</li>
                <li>• Open SQL Editor</li>
                <li>• Copy and paste the entire contents of schema.sql</li>
                <li>• Click "Run"</li>
              </ol>
            </div>
            
            <div>
              <p className="text-gray-300 mb-2">2. Test authentication:</p>
              <ol className="text-sm text-gray-400 ml-4 space-y-1">
                <li>• Go to /mui-portal/login</li>
                <li>• Try signing up with any email</li>
                <li>• Check if login works</li>
              </ol>
            </div>

            <div>
              <p className="text-gray-300 mb-2">3. Admin access:</p>
              <p className="text-sm text-gray-400">
                Use admin@muiportal.com or officialsiranthony@gmail.com for admin access
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={checkConnection}
            className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded"
          >
            Check Connection
          </button>
          
          <a
            href="/mui-portal"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Go to MUI Portal
          </a>
        </div>
      </div>
    </div>
  )
}
