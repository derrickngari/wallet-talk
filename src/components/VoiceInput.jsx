import { useState } from 'react'
import { startSpeechRecognition } from '../services/voiceInput'
import { saveTransaction } from '../services/transactionService'
import { toast } from 'react-toastify'

const VoiceInput = ({ user, onSave }) => {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [parsedData, setParsedData] = useState(null)



    const handleVoice = () => {
        setIsListening(true);

        startSpeechRecognition(async(data) => {
            console.log("Parsed data:", data)
            setTranscript(data.description)
            setParsedData(data)
            
            if (!data.amount) {
                toast.error('Couldn\'t detect amount. Please try again.')
                setIsListening(false)
                setParsedData('')
                return
            }

            // Call the parent's submit handler
            if (user?.id) {
                const { error } = await saveTransaction(data, user.id)
                if (error){
                    console.error('Transaction error: ', error.message)
                    toast.error('Failed to save transaction.')
                    setParsedData('')
                } else{
                    toast.success('Tranaction saved successfully!')
                    onSave && onSave()
                }
            } else {
                console.warn('You\'re not logged in. Please sign in!.')
            }
        });
        setIsListening(false);
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow-md">
            <button
                onClick={handleVoice}
                className="bg-[#F59E0B] text-white px-4 py-2 rounded-md"
            >
                {isListening ? "Listening..." : "Start Voice Input"}
            </button>
            {transcript && (
                <p className="mt-4 text-sm text-gray-600">Heard: {transcript}</p>
            )}
            {parsedData && (
                <div className="mt-2 text-xs text-green-700">
                    <p>Type: {parsedData.type}</p>
                    <p>Amount: {parsedData.amount}</p>
                    <p>Category: {parsedData.category}</p>
                </div>
            )}
        </div>
    );
}


export default VoiceInput