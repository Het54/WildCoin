package com.het.wildcoin

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Message
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.android.material.textfield.TextInputEditText
import org.json.JSONObject

class signin : AppCompatActivity() {

    private val TAG = "SignIn"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signin)
        val sharedPreferences = getSharedPreferences("user_data", Context.MODE_PRIVATE)
        val cacnt = findViewById<Button>(R.id.cbutton);
        val name = findViewById<TextInputEditText>(R.id.name);
        val emailaddress = findViewById<TextInputEditText>(R.id.emailaddress);
        val contactnumber = findViewById<TextInputEditText>(R.id.contactnumber);
        val username = findViewById<TextInputEditText>(R.id.username);
        val password = findViewById<TextInputEditText>(R.id.password);
        val sname = sharedPreferences.getString("name", null)
        val emailadd = sharedPreferences.getString("emailadd", null)
        val scnum = sharedPreferences.getString("cnum", null)
        val susername = sharedPreferences.getString("username", null)
        val spassword = sharedPreferences.getString("password", null)


//        Log.d(TAG,"name:"+sname+"email address:"+emailadd+"contact number"+scnum+"username:"+susername+"paassword:"+spassword)



        cacnt.setOnClickListener {
            val n = name.text.toString()
            val ea = emailaddress.text.toString()
            val cn = contactnumber.text.toString()
            val un = username.text.toString()
            val p = password.text.toString()

            if(n.isEmpty() || ea.isEmpty() || cn.isEmpty() || un.isEmpty() || p.isEmpty()) {

                if(n.isEmpty()){
                    Toast.makeText(applicationContext, "Name field can't be empty!!",Toast.LENGTH_SHORT).show()
                }
                if(ea.isEmpty()){
                    Toast.makeText(applicationContext, "Email Address field can't be empty!!",Toast.LENGTH_SHORT).show()
                }
                if(cn.isEmpty()){
                    Toast.makeText(applicationContext, "Contact Number field can't be empty!!",Toast.LENGTH_SHORT).show()
                }
                if(un.isEmpty()){
                    Toast.makeText(applicationContext, "Username field can't be empty!!",Toast.LENGTH_SHORT).show()
                }
                if(p.isEmpty()){
                    Toast.makeText(applicationContext, "Password field can't be empty!!",Toast.LENGTH_SHORT).show()
                }

            }
            else{

                val sharedPreferences = getSharedPreferences("user_data", MODE_PRIVATE)
                val editor: SharedPreferences.Editor= sharedPreferences.edit()
                editor.putString("name", n)
                editor.putString("emailadd", ea)
                editor.putString("cnum", cn)
                editor.putString("username", un)
                editor.putString("password", p)
                editor.commit()



                val queue = Volley.newRequestQueue(this)
                val url = "http://ec2-3-144-33-176.us-east-2.compute.amazonaws.com:3000/createacc"
                val stringRequest = StringRequest(
                    Request.Method.POST, url,
                    { response ->
                        // Display the first 500 characters of the response string.
                        //Toast.makeText(applicationContext,"$response",Toast.LENGTH_SHORT).show()
                        val jsonObject = JSONObject(response)
                        val accountid = jsonObject.getString("address")
                        val accountKey = jsonObject.getString("privateKey")
                        Log.d(TAG, "onCreate: $accountid")
                        val sharedPreferences = getSharedPreferences("user_data", MODE_PRIVATE)
                        val editor: SharedPreferences.Editor= sharedPreferences.edit()
                        editor.putString("accountID", accountid)
                        editor.putString("accountKey", accountKey)
                        editor.commit()
                        Toast.makeText(this, "Account created Successfully", Toast.LENGTH_SHORT).show()
                        val intent = Intent(applicationContext, MainActivity::class.java)
                        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK.or(Intent.FLAG_ACTIVITY_NEW_TASK)
                        startActivity(intent)
                    },
                    { error -> Toast.makeText(applicationContext,"$error",Toast.LENGTH_SHORT).show()
                        Log.d(TAG,"$error")})
                queue.add(stringRequest)

            }

        }

    }
}