package com.het.wildcoin

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.util.ObjectsCompat.hash
import com.google.android.material.textfield.TextInputEditText
import okhttp3.internal.tls.OkHostnameVerifier.verify
import org.bouncycastle.asn1.ASN1Primitive.fromByteArray
import org.bouncycastle.crypto.params.ECKeyParameters
import org.bouncycastle.crypto.signers.ECDSASigner
import org.bouncycastle.jce.provider.BouncyCastleProvider
import org.bouncycastle.math.ec.rfc8032.Ed25519.verify
import org.bouncycastle.math.ec.rfc8032.Ed448.verify
import org.bouncycastle.pqc.math.linearalgebra.ByteUtils.fromHexString
import org.bouncycastle.util.Strings.fromByteArray
import org.objectweb.asm.util.CheckClassAdapter.verify
import org.web3j.crypto.*
import org.web3j.crypto.Wallet.decrypt
import org.web3j.utils.Numeric
import org.web3j.crypto.ECKeyPair
import org.web3j.crypto.Hash
import org.web3j.crypto.Hash.hash
import org.web3j.crypto.Sign
import org.web3j.crypto.Wallet.create
import java.math.BigInteger
import java.nio.charset.Charset
import java.security.Security
import java.util.Objects.hash

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
            val balance = sharedPreferences.getString("balance", "")
            Log.d(TAG, "Balance: " + balance)
            val amt = amount.text.toString()
            if (balance != null) {
                if (balance.toDouble() >= amt.toDouble()) {
                    var generatedsign = generateSignature("056cb6b3a8f2cc317afd6d425ca8cde2ca867c32f1b372227b4f538101f5bce9", amt)
                    Log.d(TAG,"SIgnature: "+ generatedsign)

//                    var result = verifySignature(generatedsign, amt, "0x1b3ce110533Ab2C348E8A31456865F2E3723530d")
//                    Log.d(TAG,"Result: "+ result)
//                    val intent = Intent(this, SenderActivity::class.java)
//                    intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK.or(Intent.FLAG_ACTIVITY_NEW_TASK)
//                    intent.putExtra("amount", amount.text.toString())
//                    startActivity(intent)
                } else
                    Toast.makeText(
                        applicationContext,
                        "Insufficient Balance, Please try again!",
                        Toast.LENGTH_SHORT
                    ).show()


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
        val r = Numeric.toHexStringWithPrefixZeroPadded(Numeric.toBigInt(signature.r), 64)
        val s = Numeric.toHexStringWithPrefixZeroPadded(Numeric.toBigInt(signature.s), 64)
        val v = BigInteger(1, signature.v).toString(16)
        return "0x$r$s$v"
    }



}