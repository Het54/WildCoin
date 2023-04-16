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
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.android.material.textfield.TextInputEditText

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
            if (b != null) {
                b = (b.toInt() + amount.toInt()).toString()
            }
            Toast.makeText(this, "Coins Updated Successfully!", Toast.LENGTH_SHORT).show()
            val editor: SharedPreferences.Editor= sharedPreferences.edit()
            editor.putString("balance", b)
            editor.commit()
            val intent = Intent(applicationContext, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK.or(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(intent)

            val queue = Volley.newRequestQueue(this)
            val url = "https://backend-wildcoin.herokuapp.com/createAccount/transfertoaaccount"
            val stringRequest = StringRequest(
                Request.Method.POST, url,
                { response ->
                    // Display the first 500 characters of the response string.
                    Toast.makeText(applicationContext,"$response",Toast.LENGTH_SHORT).show()

                },
                { error -> Toast.makeText(applicationContext,"$error",Toast.LENGTH_SHORT).show()
                    Log.d(TAG,"$error")})
            queue.add(stringRequest)
        }
    }
}