package com.het.wildcoin

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.util.Log
import androidx.appcompat.app.AppCompatActivity

class splash_screen : AppCompatActivity() {

    private val TAG = "splash"
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash_screen)
        val sharedPreferences = getSharedPreferences("user_data", Context.MODE_PRIVATE)
        val sname = sharedPreferences.getString("name", null)
        val emailadd = sharedPreferences.getString("emailadd", null)
        val scnum = sharedPreferences.getString("cnum", null)
        val susername = sharedPreferences.getString("username", null)
        val spassword = sharedPreferences.getString("password", null)

        Log.d(TAG,"name:"+sname+"email address:"+emailadd+"contact number"+scnum+"username:"+susername+"paassword:"+spassword)


        val handler = Handler()
        handler.postDelayed(object : Runnable {
            override fun run() {
                if(sname == null && emailadd == null && scnum == null && susername == null && spassword == null){
                    val intent = Intent(applicationContext, signin::class.java)
                    startActivity(intent)
                }
                else{
                    val intent = Intent(applicationContext, MainActivity::class.java)
                    startActivity(intent)
                }
            }
        }, 1000)


    }
}