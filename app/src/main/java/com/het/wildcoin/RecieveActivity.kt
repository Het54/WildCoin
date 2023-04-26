package com.het.wildcoin

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.connection.*
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.OnSuccessListener
import com.google.gson.Gson
import java.time.Instant

class RecieveActivity : AppCompatActivity() {
    lateinit var accountID: String
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_receiving)
        val sharedPreferences = getSharedPreferences("user_data", Context.MODE_PRIVATE)
        val b = sharedPreferences.getString("balance","")
        accountID = sharedPreferences.getString("accountID", "").toString()
        val Balance_rec = findViewById<TextView>(R.id.Balance_rec)
        Balance_rec.text=b
        val buttonClick = findViewById<ImageView>(R.id.back_button_receiving)
        buttonClick.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK.or(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(intent)
        }
    }
    override fun onStart() {
        super.onStart()
        startAdvertising()
    }
    override fun onStop() {
        super.onStop()
        Nearby.getConnectionsClient(applicationContext).stopAdvertising()
    }

    private fun startAdvertising() {
        val SERVICE_ID = "com.example.wc"
        val advertisingOptions = AdvertisingOptions.Builder().setStrategy(Strategy.P2P_POINT_TO_POINT).build()
        Nearby.getConnectionsClient(applicationContext)
            .startAdvertising(
                "WildCoin", SERVICE_ID, connectionLifecycleCallback, advertisingOptions   //change first param to name of Teacher
            )
            .addOnSuccessListener(
                OnSuccessListener { unused: Void? ->

                    Toast.makeText(applicationContext,"Ready to Receive", Toast.LENGTH_SHORT).show()
                    Log.d("Receiver","Advertising success")

                })
            .addOnFailureListener(
                OnFailureListener { e: Exception? ->
                    Log.d("Receiver","Advertising fail: ${e.toString()}")
                    Toast.makeText(applicationContext,"Error Initialising: ${e.toString()}", Toast.LENGTH_SHORT).show()
                })
    }

    private val payloadCallback: PayloadCallback = object : PayloadCallback() {
        @RequiresApi(Build.VERSION_CODES.O)
        override fun onPayloadReceived(endpointId: String, payload: Payload) {

            val data_recieved = payload.asBytes()?.let { String(it, Charsets.UTF_8) }
            Log.d("Receiver","Data recieved: ${payload.asBytes()?.let { String(it, Charsets.UTF_8) }}")
            val sharedPreferences = getSharedPreferences("user_data", Context.MODE_PRIVATE)
            var b = sharedPreferences.getString("balance","")
            if (b != null) {
                if (data_recieved != null) {
                    b = (b.toInt() + data_recieved.toInt()).toString()
                }
            }
            val editor: SharedPreferences.Editor= sharedPreferences.edit()
            editor.putString("balance", b)
            editor.commit()

            Toast.makeText(applicationContext,"Data recieved: ${payload.asBytes()?.let { String(it, Charsets.UTF_8) }}",
                Toast.LENGTH_SHORT).show()

            //Get Time of The Trasanction
            val instant: Instant = Instant.now()
            val nanos = instant.nano.toLong().toString()
            val output: String = ("$instant.epochSecond:" + String.format("%1$" + nanos.length + "s", nanos).replace(' ', '0')) // Pad with leading zeros if needed.
            Log.d(Companion.TAG, "onPayloadReceived: Time: $output")

            val data_jj = mapOf(
                "message" to "Success",
                "accountID" to accountID,
                "Time" to output
            )
            val jsonData = Gson().toJson(data_jj)
            val data = Payload.fromBytes(jsonData.toByteArray())


            Nearby.getConnectionsClient(applicationContext).sendPayload(endpointId, data)
            Nearby.getConnectionsClient(applicationContext).stopAdvertising()
            val intent = Intent(applicationContext, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK.or(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(intent)
        }

        override fun onPayloadTransferUpdate(endpointId: String, update: PayloadTransferUpdate) {

        }
    }
    private val connectionLifecycleCallback: ConnectionLifecycleCallback =
        object : ConnectionLifecycleCallback() {
            override fun onConnectionInitiated(endpointId: String, connectionInfo: ConnectionInfo) {
                Nearby.getConnectionsClient(applicationContext).acceptConnection(endpointId, payloadCallback)
            }

            override fun onConnectionResult(endpointId: String, result: ConnectionResolution) {
                when (result.status.statusCode) {
                    ConnectionsStatusCodes.STATUS_OK -> {
                        Toast.makeText(applicationContext,"EndID of Sender: $endpointId", Toast.LENGTH_SHORT).show()
                    }
                    ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED -> {
                    }
                    ConnectionsStatusCodes.STATUS_ERROR -> {
                    }
                    else -> {
                    }
                }
            }

            override fun onDisconnected(endpointId: String) {

            }
        }

    companion object {
        private const val TAG = "RecieveActivity"
    }
}