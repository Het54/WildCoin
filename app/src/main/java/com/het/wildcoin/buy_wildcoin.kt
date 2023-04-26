package com.het.wildcoin

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.android.material.textfield.TextInputEditText
import org.json.JSONObject

class buy_wildcoin : AppCompatActivity() {

    private val TAG = "buy_wildcoin"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_buy_wildcoin)
        val amount_bb = findViewById<TextInputEditText>(R.id.amount_bb)
        val buttonClick = findViewById<Button>(R.id.buy_token_benze)
        val sharedPreferences = getSharedPreferences("user_data", Context.MODE_PRIVATE)
        val b = sharedPreferences.getString("balance","")
        val Balance_rec = findViewById<TextView>(R.id.Balance_bb)
        Balance_rec.text=b

        // Add the request to the RequestQueue.

        buttonClick.setOnClickListener {
            val amount = amount_bb.text.toString();
            val sharedPreferences = getSharedPreferences("user_data", MODE_PRIVATE)
            var b = sharedPreferences.getString("balance","")
            val accountID = sharedPreferences.getString("accountID", "")


            val queue = Volley.newRequestQueue(this)
            val url = "http://ec2-3-144-33-176.us-east-2.compute.amazonaws.com:3000/transfer"
            val stringRequest = object : StringRequest(Request.Method.POST, url,
                Response.Listener { response ->
                    run {
                        val jsonObject = JSONObject(response)
                        val mes = jsonObject.getString("message")
                        if(mes == "Transfer SuccessFull!") {
                            if (b != null) {
                                b = (b!!.toInt() + amount.toInt()).toString()
                            }
                            Toast.makeText(this, "Coins Updated Successfully!", Toast.LENGTH_SHORT)
                                .show()
                            val editor: SharedPreferences.Editor = sharedPreferences.edit()
                            editor.putString("balance", b)
                            editor.commit()
                            Log.d(TAG, "onCreate: address $accountID")
                            val intent = Intent(applicationContext, MainActivity::class.java)
                            intent.flags =
                                Intent.FLAG_ACTIVITY_CLEAR_TASK.or(Intent.FLAG_ACTIVITY_NEW_TASK)
                            startActivity(intent)
                        }
                    }
                },
                Response.ErrorListener { error ->
                    run {
                        Toast.makeText(applicationContext, "$error", Toast.LENGTH_SHORT).show()
                        Log.d(TAG, "$error")
                    }
                }) {
                override fun getParams(): Map<String, String> {
                    val params = HashMap<String, String>()
                    params["address_to"] = accountID.toString()
                    params["type"] = "buy"
                    params["amount"] = amount

                    return params
                }

            }
            queue.add(stringRequest)
        }
    }
}