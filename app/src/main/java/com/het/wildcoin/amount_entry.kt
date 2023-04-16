package com.het.wildcoin

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText
import org.bouncycastle.pqc.math.linearalgebra.ByteUtils.fromHexString
import org.web3j.crypto.*
import org.web3j.crypto.Wallet.decrypt
import org.web3j.utils.Numeric

class amount_entry : AppCompatActivity() {
    private val TAG = "amountentry"
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_amount_entry)
        val amount = findViewById<TextInputEditText>(R.id.amount_send)
        val back_button = findViewById<ImageView>(R.id.back_button_amount)
        val send_button_amount = findViewById<Button>(R.id.send_button_amount)

        send_button_amount.setOnClickListener {
            val sharedPreferences = getSharedPreferences("user_data", MODE_PRIVATE)
            val balance = sharedPreferences.getString("balance","")
            Log.d(TAG,"Balance: "+balance)
            val amt = amount.text.toString()
            if (balance != null) {
                Log.d(TAG,"amount while sending: "+amt)
                if(balance.toDouble() >= amt.toDouble())
                {
                    val pkey = "056cb6b3a8f2cc317afd6d425ca8cde2ca867c32f1b372227b4f538101f5bce9"
                    val generatedkey = generateSignature(pkey,"Hello World")
                    Log.d(TAG, "Generated Key: "+generatedkey)
                    val intent = Intent(this, SenderActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK.or(Intent.FLAG_ACTIVITY_NEW_TASK)
                    intent.putExtra("amount", amount.text.toString())
                    startActivity(intent)
                }
                else
                    Toast.makeText(applicationContext,"Insufficient Balance, Please try again!", Toast.LENGTH_SHORT).show()


            }

        }
        back_button.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }
    }

    fun generateSignature(privateKey: String, message: String): String {
        val ecKeyPair = ECKeyPair.create(Numeric.hexStringToByteArray(privateKey))
        val messageHash = Hash.sha3(message.toByteArray())
        val signature = Sign.signMessage(messageHash, ecKeyPair, false)
        val r = Numeric.toHexString(signature.r)
        val s = Numeric.toHexString(signature.s)
        val v = Numeric.toHexString(signature.v)
        return "0x${r}${s}${v}"
    }



}